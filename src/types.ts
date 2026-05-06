export type Page = 'discover' | 'design' | 'workshop' | 'factory' | 'my' | 'detail' | 'designer'
export type Corner = 'tl' | 'tr' | 'bl' | 'br'
export type ArchiveFilter = 'all' | 'studio' | 'community'
export type WorkshopMessage = {
  id: number
  type: 'ai' | 'user'
  sender: string
  text: string
}
export type FactoryCam = {
  id: string
  label: string
  info: string
  feedText: string
}
export type FactoryStep = {
  key: string
  title: string
  text: string
  state: 'done' | 'active' | 'pending'
}
export type AuthTab = 'login' | 'register'
export type MyOrder = {
  name: string
  id: string
  status: string
  statusType: 'prod' | 'done'
  eta: string
  muted?: boolean
}
export type MyMatrixCard = {
  name: string
  status: string
  statusType: 'public' | 'reviewing'
  renderCode: string
  cloned: string
  likes: string
  yield: string
}
export type SpotlightCard = {
  key: string
  className: string
  title: string
  center: string
  tag: string
  corners: Corner[]
}
export type DesignerProfile = {
  id: string
  displayName: string
  node: string
  title: string
  streamNote: string
}
export type DesignerAsset = {
  title: string
  engine: string
  image: string
}
export type DesignerSection = {
  id: string
  pattern: 'split' | 'triple' | 'hero'
  assets: DesignerAsset[]
  serial: number
}
