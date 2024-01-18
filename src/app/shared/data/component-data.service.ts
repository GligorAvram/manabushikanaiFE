import { BehaviorSubject, Observable, combineLatest, of } from "rxjs";
import { BaseQuery } from "./store.models";
import { takeUntilDestroy } from "ngx-reactivetoolkit";

export type ComponentInstance = any;
export type ComponentDataSource<Data extends object> = {  [Property in keyof Data]: Observable<Data[Property]> };
type BaseComponentData = {loading: boolean, success: boolean}
type FullComponentData<ComponentData extends object, ExtraComponentData extends object> = BaseComponentData & ComponentData & ExtraComponentData;

export abstract class BaseComponentDataService<ComponentData extends object, ExtraComponentData extends object> {

  componentInstance?: ComponentInstance;
  protected readonly query?: BaseQuery<any>;
  data$ : BehaviorSubject<FullComponentData<ComponentData, ExtraComponentData > | null>
  //todo check if needed
  source?: ComponentDataSource<FullComponentData<ComponentData, ExtraComponentData>>

    protected constructor(query: BaseQuery<any>){
        this.query = query;
        this.data$ = new BehaviorSubject<FullComponentData<ComponentData, ExtraComponentData> | null>(null);
    }

  init(componentInstance: ComponentInstance) {
    this.componentInstance = componentInstance;
    this.onInit();
    this.setData();
  }

  protected abstract onInit(): void;

  protected abstract dataSource(): ComponentDataSource<ComponentData>;

  protected extraDataSource(): ComponentDataSource<ExtraComponentData>{
    return {} as ComponentDataSource<ExtraComponentData>;
  }

  private setData(): void {

    const dataSource = this.dataSource();
    const extraDataSource = this.extraDataSource();
    const loading = of(false);
    const success = of(true);
    //todo
    // const loading = this.query?.selectLoading ?? of(false);
    // const success = this.query?.selectSuccess ?? of(false);

    const sources = [...Object.values(dataSource), ...Object.values(extraDataSource), loading, success];
    const keys = [...Object.keys(dataSource), ...Object.keys(extraDataSource), "loading", "success"];
    
    combineLatest(sources)
        .pipe(takeUntilDestroy(this.componentInstance))
        .subscribe(values => {
            const data: any = {};
            values.forEach( (val, index) => data[keys[index]] = val);
            this.data$.next(data as FullComponentData<ComponentData, ExtraComponentData>)
        });

        this.source = {...dataSource, ...extraDataSource, loading, success} as ComponentDataSource<FullComponentData<ComponentData, ExtraComponentData>>;
  }
}