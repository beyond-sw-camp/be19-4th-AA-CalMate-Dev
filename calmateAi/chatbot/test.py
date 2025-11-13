# test.py
import os
import json
import argparse
from calmate_ai import setup_everything, ask_question

REQUIRED_MEALS = ["breakfast", "lunch", "dinner", "snack"]

def ensure_api_key():
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError(
            "환경변수 OPENAI_API_KEY가 설정되어 있지 않습니다. "
            "예) Windows: setx OPENAI_API_KEY your_key  /  macOS/Linux: export OPENAI_API_KEY=your_key"
        )

def build_question(gender, height, weight, bmr, type, target, startDate, endDate):
    return f"""
제 신체 정보는 다음과 같습니다:
- 성별: {gender}
- 키: {height}cm
- 몸무게: {weight}kg
- 기초대사량(BMR): {bmr}kcal
- 목표: {type}
- 목표 몸무게: {target}kg
- 시작일: {startDate}
- 마감일: {endDate}


이 정보를 바탕으로, 오늘 하루치 식단을 추천해주세요.
#문맥 에서 음식을 찾을 수 없다면 "error"를 반환하세요.
""".strip()

def validate_schema(obj):
    if not isinstance(obj, dict):
        return False, "루트가 JSON 객체(dict)가 아닙니다."

    for k in ["plan_details", "summary", "error"]:
        if k not in obj:
            return False, f"필수 필드 누락: '{k}'"

    plan = obj["plan_details"]
    if not isinstance(plan, dict):
        return False, "plan_details가 객체(dict)가 아닙니다."

    for meal in REQUIRED_MEALS:
        if meal not in plan:
            return False, f"식사 키 누락: plan_details['{meal}']"
        sec = plan[meal]
        for f in ["items", "total_kcal", "total_protein_g", "total_fat_g"]:
            if f not in sec:
                return False, f"{meal}.{f} 누락"
        if not isinstance(sec["items"], list) or len(sec["items"]) == 0:
            return False, f"{meal}.items 비어있음"
        for it in sec["items"]:
            for f in ["menu_name", "serving_g", "kcal", "protein_g", "fat_g"]:
                if f not in it:
                    return False, f"{meal}.items.*.{f} 누락"

    s = obj["summary"]
    for f in ["total_kcal", "total_protein_g", "total_fat_g", "target_bmr", "weekly_weight_change_kg"]:
        if f not in s:
            return False, f"summary 필드 누락: '{f}'"

    return True, "OK"

def main():
    parser = argparse.ArgumentParser(description="RAG JSON 응답 테스트")
    parser.add_argument("--height", type=float)
    parser.add_argument("--weight", type=float)
    parser.add_argument("--bmr", type=float)
    parser.add_argument("--gender", required=True, choices=["male", "female"])
    parser.add_argument("--type", required=True, choices=["감량", "증량", "유지"])
    parser.add_argument("--target", type=float)
    parser.add_argument("--startDate", required=True, help="YYYYMMDD")
    parser.add_argument("--endDate", required=True, help="YYYYMMDD")
    # (옵션) 알레르기: 공백 구분 다중 입력 지원 → 예) --allergyNames 갑각류 호두
    parser.add_argument("--allergyNames", nargs="*", default=[])
    args = parser.parse_args()

    ensure_api_key()

    print("▶ RAG 시스템 초기화 중...")
    qa = setup_everything()
    if qa is None:
        raise RuntimeError("setup_everything()가 None을 반환했습니다. calmate_ai 내부 초기화 과정을 확인하세요.")

    q = build_question(args.gender, args.height, args.weight, args.bmr, args.type,
                       args.target, args.startDate, args.endDate)
    print("▶ LLM 호출 중...")
    raw = ask_question(qa, q)

    print("▶ JSON 파싱 중...")
    obj = json.loads(raw)

    ok, msg = validate_schema(obj)
    if not ok:
        print("❌ 스키마 검증 실패:", msg)
        print("\n--- LLM 전체 응답(JSON) ---")
        print(json.dumps(obj, ensure_ascii=False, indent=2))
        raise SystemExit(1)

    print("✅ JSON 정상 응답 & 스키마 통과!")
    s = obj["summary"]
    print("\n[요약]")
    print(f"- 총 열량: {s['total_kcal']} kcal (목표 BMR: {s['target_bmr']} kcal)")
    print(f"- 주간 예상 변화량: {s['weekly_weight_change_kg']} kg")

    print("\n[식단]")
    plan = obj["plan_details"]
    for meal in REQUIRED_MEALS:
        sec = plan[meal]
        print(f"  • {meal}: 총 {sec['total_kcal']} kcal (P {sec['total_protein_g']} g, F {sec['total_fat_g']} g)")
        for it in sec["items"]:
            print(f"     - {it['menu_name']} "
                  f"({it['serving_g']} g, {it['kcal']} kcal, "
                  f"P {it['protein_g']} g, F {it['fat_g']} g)")

if __name__ == "__main__":
    main()