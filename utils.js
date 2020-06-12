const parseString = require('xml2js').parseString;

function parseXML(entry) {
  return new Promise((resolve, reject) => {
    parseString(entry, (err, result) => {
      try {
        const ebookData = result['rdf:RDF']['pgterms:ebook'][0];
        const about = ebookData['$']['rdf:about'];
        const creator = ebookData['dcterms:creator'];
        const subject = ebookData['dcterms:subject']
        const payload = {
          id: about.split('/')[1],
          title: ebookData?.['dcterms:title']?.[0],
          authors: Array.isArray(creator) &&
            creator.map(c => c?.['pgterms:agent']?.[0]?.['pgterms:name']?.[0])
              .filter(Boolean)
              .join(', '),
          publisher: ebookData?.['dcterms:publisher']?.[0],
          publicationDate: ebookData?.['dcterms:issued']?.[0]?.['_'],
          language: ebookData?.['dcterms:language']?.[0]?.['rdf:Description']?.[0]?.['rdf:value']?.[0]?.['_'],
          subjects: Array.isArray(subject) &&
            subject.map(s => s?.['rdf:Description']?.[0]?.['rdf:value']?.[0])
              .filter(Boolean)
              .join(', '),
          license: ebookData?.['dcterms:license']?.[0]?.['$']?.['rdf:resource']
        };
        resolve(payload);
      } catch (e) {
        throw new Error('Entry is not properly formated.');
      }
    });
  });
}

module.exports = {
  parseXML
}