const { parseXML } = require('../utils');

const XML = `
<?xml version="1.0" encoding="utf-8"?>
<rdf:RDF>
  <pgterms:ebook rdf:about="ebooks/1">
    <dcterms:creator>
      <pgterms:agent>
        <pgterms:name>Test name 1</pgterms:name>
      </pgterms:agent>
    </dcterms:creator>
    <dcterms:creator>
      <pgterms:agent>
        <pgterms:name>Test name 2</pgterms:name>
      </pgterms:agent>
    </dcterms:creator>
    <dcterms:subject>
      <rdf:Description>
        <rdf:value>Subject 1</rdf:value>
      </rdf:Description>
    </dcterms:subject>
    <dcterms:subject>
      <rdf:Description>
        <rdf:value>Subject 2</rdf:value>
      </rdf:Description>
    </dcterms:subject>
    <dcterms:publisher>Test publisher</dcterms:publisher>
    <dcterms:title>Test title</dcterms:title>
    <dcterms:license rdf:resource="license"/>
    <dcterms:issued rdf:datatype="http://www.w3.org/2001/XMLSchema#date">2020-01-01</dcterms:issued>
    <dcterms:language>
      <rdf:Description>
        <rdf:value rdf:datatype="http://purl.org/dc/terms/RFC4646">en</rdf:value>
      </rdf:Description>
    </dcterms:language>
  </pgterms:ebook>
</rdf:RDF>
`;

const XML2 = `
<?xml version="1.0" encoding="utf-8"?>
<rdf:RDF>
  <pgterms:ebook rdf:about="ebooks/1">
  </pgterms:ebook>
</rdf:RDF>
`;

const XML3 = `
<?xml version="1.0" encoding="utf-8"?>
<rdf:RDF>
  <pgterms:ebook rdf:about="ebooks/asd">
  </pgterms:ebook>
</rdf:RDF>
`;

const result = {
  id: 1,
  title: 'Test title',
  authors: 'Test name 1, Test name 2',
  publisher: 'Test publisher',
  publicationDate: '2020-01-01',
  language: 'en',
  subjects: 'Subject 1, Subject 2',
  license: 'license'
};

describe('parseXML', () => {
  it('should properly parse XML', async () => {
    await expect(parseXML(XML)).resolves.toEqual(result);
  });

  it('should properly parse XML when fields missing', async () => {
    await expect(parseXML(XML2)).resolves.toEqual({ id: 1 });
  });

  it('should throw on empty file', async () => {
    await expect(parseXML('')).rejects.toThrow();
  })

  it('should throw on incorrect id', async () => {
    await expect(parseXML(XML3)).rejects.toThrow();
  })
})