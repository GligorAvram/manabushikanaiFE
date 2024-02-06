export interface BaseState {
    success: boolean;
    loading: boolean
}

export interface BaseEntityState<Entity> extends BaseState{
    entities: Entity[];
    active: Entity | undefined | null;
}