const headers = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
const anchor = document.createElement('a')
anchor.classList.add('anchor')

const getSlug = (text) => {
  return text
    .replace(/(\s)/g, '-')
    .replace(/(\(.*\))/g, '')
    .replace(/:/g, '')
    .toLowerCase()
}

headers.forEach(header => {
  const anchorClone = anchor.cloneNode(true)
  const title = getSlug(header.textContent)
  anchorClone.name = title
  anchorClone.href = `#${title}`
  header.insertAdjacentElement('afterBegin', anchorClone)
})
