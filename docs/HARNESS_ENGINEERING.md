# Harness Engineering

## Definition

Harness engineering is the practice of designing the operating system around an AI agent.

The harness includes:

- Instruction files
- Tool setup
- Project structure
- Permission rules
- Scripts
- Tests
- Logs
- Screenshots
- Reports
- Approval gates

## Harness engineer role

A harness engineer is responsible for making AI work reliable.

They do not only write prompts. They build the environment that forces the AI to:

1. Read the right context.
2. Work inside the correct scope.
3. Use the right tools.
4. Validate outputs.
5. Document evidence.
6. Stop before irreversible actions.

## Layers

| Layer | Question |
|---|---|
| Prompt | What should the agent do? |
| Context | What does the agent need to know? |
| Tools | What can the agent use? |
| Loop | How does the agent repeat, test, and fix? |
| Harness | How is the whole workflow governed? |
| Human gate | What requires explicit approval? |

## Your harness engineer checklist

- [ ] Define project identity.
- [ ] Define source-of-truth files.
- [ ] Define allowed scope.
- [ ] Define forbidden actions.
- [ ] Define setup commands.
- [ ] Define validation commands.
- [ ] Define failure protocol.
- [ ] Define report format.
- [ ] Define approval gates.
