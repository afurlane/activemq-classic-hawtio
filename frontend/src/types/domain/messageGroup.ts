export type QueueMessageGroupState = 'assigned' | 'unassigned'

export interface QueueMessageGroup {
  id: string
  consumerId: string | null
  state: QueueMessageGroupState
}

export interface QueueMessageGroupsInfo {
  supported: boolean
  type: string | null
  groups: QueueMessageGroup[]
  totals: {
    total: number
    assigned: number
    unassigned: number
  }
}
