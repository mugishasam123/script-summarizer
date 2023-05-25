import * as dotenv from "dotenv";
import { OpenAI } from "langchain";

import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import PDFParser from "pdf-parse"


dotenv.config();

const pdfextract = () => {
  // Read the PDF file
  const pdfBuffer = fs.readFileSync('./TV Scripts /Curb-Your-Enthusiasm-compressed.pdf');
  // Parse the PDF content
  PDFParser(pdfBuffer).then(function (data) {
    const textContent = data.text;

    // Write the extracted text to a text file
    fs.writeFileSync('./content/output.txt', textContent);

    console.log('PDF converted to text successfully!');
  }).catch(function (error) {
    console.error('Error:', error);
  });

}

const run = async () => {
 
  pdfextract()
  
  console.log(process.cwd())
  const text = fs.readFileSync("./content/output.txt", "utf8");

  const model = new OpenAI({ temperature: 0 });

  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });


  const docs = await textSplitter.createDocuments([text]);
  // This convenience function creates a document chain prompted to summarize a set of documents.
  const chain = loadSummarizationChain(model, { type: "map_reduce" });
  const res = await chain.call({
    input_documents: docs,
  });
  console.log(res.text);


};

run()