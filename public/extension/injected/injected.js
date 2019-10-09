/* Source: https://stackoverflow.com/a/2117523 */
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const __XSTATE_DEVTOOLS_EXTENSION__ = {
  connect: ({ machine, state }) => {
    const serviceId = uuidv4();
    window.postMessage({
      type: 'connect',
      payload: {
        serviceId: serviceId,
        machine: JSON.stringify(machine.config),
        state: JSON.stringify(state)
      }
    });

    return {
      send: ({ state, event }) => {
        const formattedEvent = {
          event: event,
          time: Date.now()
        };
        window.postMessage({
          type: 'update',
          payload: {
            serviceId: serviceId,
            state: JSON.stringify(state),
            event: JSON.stringify(formattedEvent)
          }
        });
      },
      disconnect: () => {
        window.postMessage({
          type: 'disconnect',
          payload: {
            serviceId: serviceId
          }
        });
      }
    };
  }
};

window.__XSTATE_DEVTOOLS_EXTENSION__ = __XSTATE_DEVTOOLS_EXTENSION__;
