# checkbox-list

Checkbox list custom element
![](./checkbox-list.element.gif?raw=true)

## Properties

| Property  | Type            | Description                                                                  |
| --------- | --------------- | ---------------------------------------------------------------------------- |
| `options` | `Option<any>[]` | Set available options.<br />`Option<V = any> = { label: string; value: V; }` |
| `value`   | `string[]`      | Set checkbox-list value                                                      |

## Events

| Event    | Description                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------- |
| `change` | Emits custom event when value is changed, event.detail contains new new value - array of strings. |
