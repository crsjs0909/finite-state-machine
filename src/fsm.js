class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.memento = [];

        this.memento[0] = config['initial'];
        this.tailPtr = 1;
        this.statePtr = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.memento[this.statePtr]
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        let st = this.config.states[state];
        if (st === undefined) {
            throw new Error;
        }
        this.memento[++this.statePtr] = state;
        this.tailPtr = this.statePtr + 1;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let newSt = this.config.states[this.getState()]['transitions'][event];
        if (newSt === undefined) {
            this.tailPtr = this.statePtr + 1;
            throw new Error;
        }
        else {
            this.changeState(newSt);
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.tailPtr = 1;
        this.statePtr = 0;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let stArr = Object.getOwnPropertyNames(this.config.states);
        let result = [];
        for (let i = 0; i < stArr.length; i++) {
            if (event === undefined || event === null || event === "") {
                result.push(stArr[i]);
            } else {
                if (this.config.states[stArr[i]].transitions[event] !== undefined) {
                    result.push(stArr[i]);
                }
            }
        }
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.statePtr === 0) {
            return false;
        }
        else {
            this.statePtr--;
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.statePtr >= this.tailPtr - 1) {
            return false;
        }
        else {
            this.statePtr++;
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.tailPtr = 1;
        this.statePtr = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
