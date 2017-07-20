export function sendEventAction(context, actionName, valueName, updatedValue) {
  let action = context.get(actionName);

  if (typeof action === 'function') {
    let newValue = action(updatedValue);

    context.set(valueName, typeof newValue !== 'undefined' ? newValue : updatedValue);

    return;
  }

  context.set(valueName, updatedValue);

  context.sendAction(actionName, updatedValue);
}
