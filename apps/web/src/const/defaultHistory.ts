const defaultHistory = `
## 🌟 Welcome to \`toci\`, The AI Teacher
\`\`\`mermaid
graph TD
  X[Supports x] 
  Y[Mermaid]
  Z[Latex]
  X -- supports -->Y
  X -- supports -->Z
\`\`\`

### ✏️ Math Definitions

inline,

$f(x) = \\int_0^x e^{-t^2} dt$

Multiline,

$$
f(x) = \\log(x + 1)
$$

## Code Examples
\`\`\`python
def hello(name: str) -> str:
    return f"Hello, {name}!"
\`\`\`
`

export default defaultHistory