import { isEqual } from "lodash-es";
import { Observable, distinctUntilChanged } from "rxjs";


export function ignoreConsecutiveDuplicateValues<T>(
  source$: Observable<T>,
): Observable<T> {
  return source$.pipe(
    distinctUntilChanged((previous, current) => isEqual(previous, current)),
  );
}


