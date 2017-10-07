---
title: api/a.markdown
---

hello, im `api/a.markdown`!

```render-jsx
export default class Demo extends React.Component {
  componentDidMount() {
    setInterval(() => this.forceUpdate(), 500)
  }
  render() {
    return <h1>This is cool times {Date.now()}</h1>
  }
}
```