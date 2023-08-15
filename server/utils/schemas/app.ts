// import { IMedia } from './media'

export interface IParams {
  resource: string
  match?: object
  page?: number
  perPage?: number
  sort?: object
  lookup?: object
}

export interface IAppData {
  docs: Array<unknown>
  totalCount: number
}

// export interface ISort {
//   [key: string]: number
//   // field: string
//   // order: number
// }

export interface ISelectOption {
  value: string
  text: string
}
