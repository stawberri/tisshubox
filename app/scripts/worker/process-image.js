const {nativeImage} = req('electron')
const fileType = req('file-type')
const getImageColors = req('get-image-colors')
const chroma = req('chroma-js')

module.exports = async (tisshubox, {id, url}) => {
  try {
    tisshubox.log('received')
    let response = await fetch(url)
    let buffer = Buffer.from(await response.arrayBuffer())
    let image = nativeImage.createFromBuffer(buffer)

    let type = fileType(buffer).mime
    let size = image.getSize()

    let colors = await getImageColors(buffer, type)
    colors.sort((a, b) =>
      chroma.contrast(a, '#fff') - chroma.contrast(b, '#fff')
    )
    colors = colors.map(color => color.hex())

    tisshubox.dispatch('posts/processResults', {id, data: {
      ready: true,
      type, size,
      colors
    }})
    tisshubox.log('dispatched')
  } catch(err) {
    let {message} = err
    let error = {message}
    tisshubox.commit('posts/edit', {id, data: {error}})
  }
}
