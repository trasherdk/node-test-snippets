# autoComplete.js

### Repository: [GitHub autoComplete.js](https://github.com/trasherdk/autoComplete.js)



# Snippets


####  [Snippet: Automatically selecting first result #4](https://github.com/trasherdk/autoComplete.js/issues/4)

**Q**:
 What would be the recommended way of automatically highlighting the first result in the drop down?

 Therefore when enter key is pressed, the selection event will fire for that first result?

**A**:
```js
events: {
  input: {
    keydown: ( event ) => {
      if( event.key == 'Enter' ) {
         autoCompleteJS.select(0)
      }
    }
  }
}
```
