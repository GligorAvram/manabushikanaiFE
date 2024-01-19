export enum StoreNameEnum {
    Writer                   = 'writer',
    Reader                   = 'reader'
}

export const Stores: StoreNameEnum[] = Object.values(StoreNameEnum);

export const PERSIST_STORAGE = 'persistStorage';