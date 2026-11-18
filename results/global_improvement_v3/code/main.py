"""Run V3 once; preserve older artifacts and never tune on the inspected final test."""
import json
import traceback
from config import OUT,PROTOCOL
from features import load_history,save_json,snapshot
from prediction import run_predictions
from statistical_analysis import paired_prediction,associations
from crop_stability import run_stability
from visualization import create_charts
from verification import verify
from reports import write_reports
from additional_audit import audit


def main():
    if (OUT/'tables/analysis_records.csv').exists():
        raise FileExistsError('V3 prediction outputs already exist. Preserve this version; use a new version for another run.')
    for folder in ['tables','charts','reports','verification','website_review']:
        (OUT/folder).mkdir(parents=True,exist_ok=True)
    if not (OUT/'verification/preservation_before.json').exists():
        save_json(OUT/'verification/preservation_before.json',snapshot())
    save_json(OUT/'verification/protocol.json',PROTOCOL)  # Written before any fitting.
    data,climate = load_history()
    frame,scores = run_predictions(data)
    paired = paired_prediction(frame)
    associations(frame)
    stability = run_stability(frame)
    create_charts(frame,scores,stability)
    verification = verify(frame,scores,data,stability)
    audit()
    write_reports()
    print(json.dumps(dict(observations=len(frame),matched_records=int(__import__('pandas').read_csv(OUT/'tables/stability_matched_records.csv').shape[0]),
                         verification=verification['status'],passes=verification['pass_count']),indent=2),flush=True)


if __name__ == '__main__':
    try:
        main()
    except Exception:
        (OUT/'verification/run_error.txt').write_text(traceback.format_exc(),encoding='utf-8')
        raise
