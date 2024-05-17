import { AskResponse, Citation } from '@api/index'
import { cloneDeep } from 'lodash-es'

export type ParsedAnswer = {
  citations: { [key: string]: CitationsContainer }
  markdownFormatText: string
}

export type CitationsContainer = {
  referenceNumber: number;
  citations: Citation[];
}

const lengthDocN = '[doc'.length

// const enumerateCitations = (citations: Citation[]) => {
//   const filepathMap = new Map()
//   for (const citation of citations) {
//     const { filepath } = citation
//     let part_i = 1
//     if (filepathMap.has(filepath)) {
//       part_i = filepathMap.get(filepath) + 1
//     }
//     filepathMap.set(filepath, part_i)
//     citation.part_index = part_i
//   }
//   return citations
// }

function removeDuplicateLinks(text: string) {
  const regex = /((\^\d\^\s)+)/g

  return text.replace(regex, '$1');
}

export function parseAnswer(answer: AskResponse): ParsedAnswer {
  let answerText = answer.answer
  const citationLinks = answerText.match(/\[(doc\d\d?\d?)]/g)

  const filteredCitations: { [key: string]: CitationsContainer } = {}; // url: [count=1, citations[chunk1, chunk2]]

  let citationIndex = 1
  answer.citations.forEach(citation => {
    if (citation.url) {
      if (!filteredCitations[citation.url]) {
        filteredCitations[citation.url] = { referenceNumber: citationIndex, citations: [] };
        citationIndex++;
      }

      filteredCitations[citation.url].citations.push(citation);
    }
  })

  // convert [doc1], [doc2], ... [docN] references in answer respective to a single reference number and a url
  citationLinks?.forEach(docNRef => {
    let answerCitationIndex = docNRef.slice(lengthDocN, docNRef.length - 1)
    let citation = cloneDeep(answer.citations[Number(answerCitationIndex) - 1]) as Citation

    // replace [doc1] with markdown for reference# and url
    if (citation && citation.url && filteredCitations[citation.url]) {
      // const refLinkMarkdown = ` ^[[${filteredCitations[citation.url].referenceNumber}](${citation.url})]^ `
      answerText = answerText.replaceAll(docNRef, ` ^${filteredCitations[citation.url].referenceNumber}^ `)
    }
    // check for [doc1][doc2][doc3] if they all point to the same url
  })

  answerText = answerText.replace(/(\^\d+\^)\s*(?=\1)/g, '');

  return {
    citations: filteredCitations,
    markdownFormatText: answerText
  }
}

// export function parseAnswer(answer: AskResponse): ParsedAnswer {
//   let answerText = answer.answer
//   const citationLinks = answerText.match(/\[(doc\d\d?\d?)]/g)

//   const lengthDocN = '[doc'.length

//   let filteredCitations = [] as Citation[]
//   let citationReindex = 0
//   citationLinks?.forEach(link => {
//     // Replacing the links/citations with number
//     let citationIndex = link.slice(lengthDocN, link.length - 1)
//     let citation = cloneDeep(answer.citations[Number(citationIndex) - 1]) as Citation
//     if (!filteredCitations.find(c => c.id === citationIndex) && citation) {
//       answerText = answerText.replaceAll(link, ` ^${++citationReindex}^ `)
//       citation.id = citationIndex // original doc index to de-dupe
//       citation.reindex_id = citationReindex.toString() // reindex from 1 for display
//       filteredCitations.push(citation)
//     }
//   })

//   filteredCitations = enumerateCitations(filteredCitations)

//   return {
//     citations: filteredCitations,
//     markdownFormatText: answerText
//   }
// }
