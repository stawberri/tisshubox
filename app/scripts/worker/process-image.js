const {nativeImage} = req('electron')
const fileType = req('file-type')
const getImageColors = req('get-image-colors')
const chroma = req('chroma-js')

module.exports = async (tisshubox, {id, data}) => {
  try {
    let image = nativeImage.createFromBuffer(data)

    let type = fileType(data).mime
    let size = image.getSize()

    let colors = await getImageColors(data, type)
    colors.sort((a, b) =>
      chroma.contrast(a, '#fff') - chroma.contrast(b, '#fff')
    )
    colors = colors.map(color => color.hex())

    tisshubox.dispatch('posts/processResults', {id, data: {
      ready: true,
      type, size,
      colors
    }})
  } catch(err) {
    let {message} = err
    let error = {message}
    tisshubox.commit('posts/edit', {id, data: {error}})
  }
}
