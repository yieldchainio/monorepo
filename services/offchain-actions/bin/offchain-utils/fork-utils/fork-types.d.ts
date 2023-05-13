export interface ForkResponse {
    fork_status: boolean;
    requester_id: string | null;
    fork_id: string | null;
    json_rpc_url: string | null;
}
