// custom search engine
function searchEngine (query, record) {
  return record
}

const autoCompleteJS = new autoComplete({
  selector: '#autoComplete',
  placeHolder: 'Search for your stuff',
  searchEngine, // Strict, loose or custom search engine
  data: {
    src: async (query) => {
      try {
        // Fetch Data from external Source
        const source = await fetch('your api endpoint')
        const data = await source.json()
        return data
      } catch (error) {
        return error
      }
    },
    // Gets the value for the specified key from your api's response
    keys: ['my-api-value']
  },
  resultItem: {
    highlight: true, // Does not work with custom search engine. You'll need to implement this yourself if necessary
    element: (item, data) => {
      // Here you can modify the div containing your data (item) and your data (data).
    }
  },
  events: {
    input: {
      selection: (event) => {
        // I use this for accessing the data of the result selected by the user.
      }
    }
  }
})
