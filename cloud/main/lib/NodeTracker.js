"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
class NodeTracker extends eventUtils_1.TypedEventEmitter {
    get count() {
        return this.nodesInSeenOrder.length;
    }
    get nodes() {
        return [...this.nodesInSeenOrder];
    }
    constructor(lastSeenCutoffMinutes = 120) {
        super();
        this.lastSeenCutoffMinutes = lastSeenCutoffMinutes;
        this.nodeHealthByIdentity = {};
        this.nodesByIdentity = {};
        this.nodesInSeenOrder = [];
    }
    track(node) {
        if (this.nodesByIdentity[node.nodeId]) {
            const lastSeen = this.nodesByIdentity[node.nodeId].lastSeenDate;
            if (node.lastSeenDate > lastSeen) {
                this.nodesByIdentity[node.nodeId].lastSeenDate = node.lastSeenDate;
            }
            this.sortSeenNodes();
            return;
        }
        node.lastSeenDate ??= new Date();
        this.nodesByIdentity[node.nodeId] = node;
        this.nodesInSeenOrder.push(node);
        this.sortSeenNodes();
        this.emit('new', { node });
        const nodes = this.nodes;
        return { nodes };
    }
    checkin(health) {
        this.nodeHealthByIdentity[health.nodeId] = health;
        this.nodesByIdentity[health.nodeId].lastSeenDate = new Date();
        this.sortSeenNodes();
    }
    sortSeenNodes() {
        this.prune();
        this.nodesInSeenOrder.sort((a, b) => b.lastSeenDate.getTime() - a.lastSeenDate.getTime());
    }
    prune() {
        // prune unseen connections
        const lastSeenCutoff = Date.now() - this.lastSeenCutoffMinutes * 60e3;
        this.nodesInSeenOrder = this.nodesInSeenOrder.filter(x => {
            if (x.lastSeenDate.getTime() < lastSeenCutoff) {
                delete this.nodesByIdentity[x.nodeId];
                return false;
            }
            return true;
        });
    }
}
exports.default = NodeTracker;
//# sourceMappingURL=NodeTracker.js.map