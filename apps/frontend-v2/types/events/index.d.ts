/**
 * @notice
 * Typings for events that are consumed throughout the frontend,
 */
/**
 * An enum reprenting all event types
 */
export declare enum EventTypes {
    MODAL_OPEN = "MODAL_OPEN",
    MENU_OPEN = "MENU_OPEN",
    WALLET_CONNECTED = "WALLET_CONNECTED",
    NETWORK_SWITCH = "NETWORK_SWITCH",
    STRATEGY_INITIATED = "STRATEGY_INITIATED",
    STRATEGY_DEPLOYED = "STRATEGY_DEPLOYED"
}
/**
 * A base interface for the event data which is extended by utility interfaces,
 * only includes "id" for identifyin events
 */
export interface BaseEventData {
    id: string | number;
}
