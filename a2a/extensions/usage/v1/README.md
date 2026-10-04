# Usage Extension v1

An A2A extension that reports what a task cost: the tokens its LLM calls spent and how its agent
loop ran. The A2A specification defines no usage field, so this extension carries it in the task
metadata, namespaced by the extension URI.

**URI:** `https://github.com/inference-gateway/schemas/tree/main/a2a/extensions/usage/v1`

## Declaration

An agent that supports the extension lists it in its Agent Card. The extension only adds data, so
it is never required.

```json
{
  "capabilities": {
    "extensions": [
      {
        "uri": "https://github.com/inference-gateway/schemas/tree/main/a2a/extensions/usage/v1",
        "description": "Reports the task's token usage and execution stats in its metadata.",
        "required": false
      }
    ]
  }
}
```

## Activation

The extension is inactive by default. A client activates it per request by listing the URI in the
`A2A-Extensions` header. Send it on every request that returns a task, `GetTask` and `ListTasks`
included, not only on `SendMessage`.

```http
A2A-Extensions: https://github.com/inference-gateway/schemas/tree/main/a2a/extensions/usage/v1
```

An agent that activated it echoes the URI in the `A2A-Extensions` response header. A task returned
to a request that did not activate the extension carries none of its keys. Push notifications have
no request to activate it, so they never carry them.

## Task Metadata

The agent writes two keys into `Task.metadata` once the task reaches a terminal or interrupted
state.

| Key                     | Value                                                                                                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<URI>/usage`           | `prompt_tokens`, `completion_tokens` and `total_tokens`, each an integer summed over every LLM call of the task. Present only when at least one LLM call reported usage.                                                |
| `<URI>/execution_stats` | `iterations` (agent loop iterations), `messages` (messages the agent loop added to the conversation), `tool_calls` (tools the agent invoked) and `failed_tools` (tool calls that failed). Present whenever the agent tracked the task's run. |

A client that finds `<URI>/execution_stats` but no `<URI>/usage` must treat the token counts as
unknown, not as zero.

## Example

```json
{
  "id": "7c1d9a7e-3f0b-4f6e-9d2a-1b5e8c4a2f10",
  "status": { "state": "TASK_STATE_COMPLETED" },
  "metadata": {
    "https://github.com/inference-gateway/schemas/tree/main/a2a/extensions/usage/v1/usage": {
      "prompt_tokens": 1200,
      "completion_tokens": 80,
      "total_tokens": 1280
    },
    "https://github.com/inference-gateway/schemas/tree/main/a2a/extensions/usage/v1/execution_stats": {
      "iterations": 3,
      "messages": 4,
      "tool_calls": 1,
      "failed_tools": 0
    }
  }
}
```

## Versioning

A breaking change to the keys or their values ships under a new URI (`.../usage/v2`). Adding an
optional field to either object is not breaking.
