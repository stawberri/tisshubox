const fileType = req('file-type')
const getImageColors = req('get-image-colors')
const chroma = req('chroma-js')

module.exports = async (tisshubox, {id, url}) => {
  try {
    let response = await fetch(url)
    let buffer = Buffer.from(await response.arrayBuffer())

    let type = fileType(buffer).mime

    let colors = await getImageColors(buffer, type)
    colors.sort((a, b) =>
      chroma.contrast(a, '#fff') - chroma.contrast(b, '#fff')
    )
    colors = colors.map(color => color.hex())

    tisshubox.commit('posts/edit', {id, data: {
      ready: true,
      type,
      colors
    }})
  } catch(error) {
    tisshubox.commit('posts/edit', {id, data: {error}})
  }
}
