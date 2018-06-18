const parseString = require('xml2js').parseString

const processData = {
  init: function(xml) {
    let parsedData
    parseString(xml, (err, result) => {
      parsedData = result
    })
    return parsedData    
  },
  result: function(data, parsedData) {
    data.resultNumber = Number(parsedData.aquabrowser.meta[0].count[0])
    return data
  },
  resultPage: function(data) {    
    let dataObj = data.aquabrowser.results[0].result.map((result) => {

      let s = result.titles[0]['short-title'][0]._
      let n = s.indexOf(':')
      s = s.substring(0, n != -1 ? n : s.length)

      console.log(s)

      let title = result.titles[0]['short-title'][0]._
      let titleIndex = title.indexOf(':')
      title = title.substring(0, titleIndex != -1 ? titleIndex : title.length)

      return {
        title: title,
        author: result.authors[0]['main-author'][0]._,
        ppn: result.identifiers[0]['ppn-id'][0]._,
        obaId: result.id[0].$.nativeid,
      }
    })
    return dataObj
  },
  detailPage: function(data) {
    console.log(data.aquabrowser)
    let dataObj = {
      title: data.aquabrowser.titles[0]['short-title'][0]._,
      author: data.aquabrowser.authors[0]['main-author'][0]._,
      ppn: data.aquabrowser.identifiers[0]['ppn-id'][0]._
    }

    if(data.aquabrowser.summaries) {
      dataObj.summary = data.aquabrowser.summaries[0]['summary'][0]._
    }
    return dataObj
  },
  send: function(io, socket, data) {
    io.to(socket.id).emit('searchCount', data.resultNumber)
  } 
}

module.exports = processData