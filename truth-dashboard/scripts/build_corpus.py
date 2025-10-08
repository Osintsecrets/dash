import os, json, time, hashlib
from pathlib import Path
import requests, yaml

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
CFG = DATA / "sources.yml"
FEED = DATA / "feed.json"
IDX  = DATA / "search_index.json"

DEF_EXCERPT_LEN = 300
DEF_CONTENT_LEN = 12000

def h16(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()[:16]

def jget(url, headers=None, params=None):
    r = requests.get(url, headers=headers or {}, params=params or {}, timeout=30)
    r.raise_for_status()
    return r.json()

# ------------------- Quran.com -------------------

def fetch_quran(cfg):
    base = cfg["base"].rstrip('/')
    items = []
    for chap in cfg.get("chapters", []):
        page = 1
        while True:
            data = jget(f"{base}/verses/by_chapter/{chap}", params={
                "language":"en","words":False,"page":page,"per_page":50
            })
            verses = data.get("verses", [])
            if not verses: break
            for v in verses:
                verse_key = v.get("verse_key") or f"{chap}:{v.get('verse_number')}"
                trans_texts = []
                for tr_id in (cfg.get("translations") or []):
                    t = jget(f"{base}/verses/{v['id']}/translations", params={"translations": tr_id})
                    for row in t.get("translations", []):
                        if row.get("text"): trans_texts.append(row["text"])
                combined = " ".join(trans_texts).strip()
                url = f"https://quran.com/{chap}/{verse_key.split(':')[-1]}"
                items.append({
                    "id": h16(f"q:{verse_key}"),
                    "source": "Quran.com",
                    "url": url,
                    "title": f"Qur'an {verse_key}",
                    "published": None,
                    "lang": "ar+en",
                    "tags": ["Quran", f"Surah {chap}"],
                    "excerpt": combined[:DEF_EXCERPT_LEN],
                    "content": combined[:DEF_CONTENT_LEN],
                })
            page += 1
    return items

# ------------------- Sunnah.com -------------------

def fetch_sunnah(cfg):
    base = cfg["base"].rstrip('/')
    key = os.environ.get("SUNNAH_API_KEY")
    if not key:
        print("WARN: SUNNAH_API_KEY not set; skipping Sunnah.com API.")
        return []
    H = {"X-API-Key": key}
    items = []
    for coll in cfg.get("collections", []):
        page = 1
        fetched = 0
        limit = int(cfg.get("per_collection_limit", 200))
        while True:
            data = jget(f"{base}/collections/{coll}/hadiths", headers=H, params={"page": page})
            hadiths = data.get("data") or data.get("hadiths") or []
            if not hadiths: break
            for h in hadiths:
                num = h.get("hadithNumber") or h.get("hadithnumber") or h.get("hadith_no")
                en  = (h.get("english") or h.get("text_en") or h.get("hadithEnglish") or "").strip()
                ar  = (h.get("arabic")  or h.get("text_ar") or h.get("hadithArabic")  or "").strip()
                combined = (en + " " + ar).strip()
                url = f"https://sunnah.com/{coll}:{num}" if num else f"https://sunnah.com/{coll}"
                items.append({
                    "id": h16(f"s:{coll}:{num}"),
                    "source": f"Sunnah.com – {coll.capitalize()}",
                    "url": url,
                    "title": f"{coll.capitalize()} {num}" if num else f"{coll.capitalize()}",
                    "published": None,
                    "lang": "ar+en",
                    "tags": ["Hadith", coll],
                    "excerpt": combined[:DEF_EXCERPT_LEN],
                    "content": combined[:DEF_CONTENT_LEN],
                })
                fetched += 1
                if fetched >= limit: break
            if fetched >= limit: break
            page += 1
            time.sleep(0.25)
    return items

# ------------------- Build -------------------

def main():
    DATA.mkdir(exist_ok=True, parents=True)
    cfg = yaml.safe_load(CFG.read_text(encoding="utf-8"))

    quran_items  = fetch_quran(cfg["quran_api"]) if cfg.get("quran_api") else []
    sunnah_items = fetch_sunnah(cfg["sunnah_api"]) if cfg.get("sunnah_api") else []
    items = quran_items + sunnah_items

    cards = [{
        "id": it["id"], "source": it["source"], "url": it["url"],
        "title": it["title"], "published": it["published"], "excerpt": it["excerpt"]
    } for it in items]

    FEED.write_text(json.dumps({"items": cards}, ensure_ascii=False, indent=2), encoding="utf-8")
    IDX.write_text(json.dumps({"items": items}, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Quran: {len(quran_items)} | Sunnah: {len(sunnah_items)} | Total: {len(items)}")

if __name__ == "__main__":
    main()
