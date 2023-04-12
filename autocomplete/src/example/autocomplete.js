const autoCompleteJS = new autoComplete({
  selector: '#autoComplete',
  placeHolder: 'Buscar...',
  searchEngine: 'strict',
  data: {
    src: async (query) => {
      try {
        const source = await fetch(`/search-autocomplete?q=${query}`)
        const data = await source.json()
        return data.products
      } catch (error) {
        return error
      }
    },
    keys: ['title']
  },
  resultsList: {
    tag: 'ul',
    id: 'autoComplete_list',
    class: 'results_list',
    destination: '#autoComplete',
    position: 'afterend',
    maxResults: 5,
    noResults: true,
    element: (list, data) => {
      if (data.results.length) {
        console.log('asd')
      } else {
        // Create "No Results" message element
        const message = document.createElement('div')
        // Add class to the created element
        message.setAttribute('class', 'no_result')
        // Add message text content
        message.innerHTML = `<span>Found No Results for "${data.query}"</span>`
        // Append message element to the results list
        list.prepend(message)
      }
    }
  },
  resultItem: {
    element: (item, data) => {
      // Modify Results Item Style
      item.style = 'display: flex; justify-content: space-between;'
      // Modify Results Item Content
      item.innerHTML = `
            <div class="flex gap-2">
                <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded border">
                    <img
                        src="/storage/img/product/50/${data.value.featured_image.name}.jpg"
                        class="h-full w-full object-contain"
                    />
                </div>
                <div class="whitespace-normal line-clamp-1">
                    ${data.value.title}
                </div>
            </div>`
    },
    highlight: true
  },
  events: {
    input: {
      focus: (event) => {
        console.log('Input Field in focus!')
        if (autoCompleteJS.input.value.length) { autoCompleteJS.start() }
      },
      selection: (event) => {
        const selection = event.detail.selection.value
        autoCompleteJS.input.value = selection
      }
    }
  }
})
