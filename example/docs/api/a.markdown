---
title: React-Render!
---

hello, im `api/a.markdown`!

```render-jsx
// export default 
@../../src/Demo.js@
```

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