---
title: React-Render & File-Syntax !!!
---

hello, im `api/a.markdown`!

`````render-jsx 
@ ../../src/refs @
`````

```render-jsx
const hoc = Comp => (Comp.title = 'new Title', Comp)

@hoc
export default class Comp extends React.Component {
  static title = 'title'
  componentDidMount() {
    
  }
  render() {
    return (
        <h3 onClick={() => alert(Date.now())}>
          {Comp.title}
        </h3>
    )
  }
}
```

```jsx
@../../src/PureText@
```