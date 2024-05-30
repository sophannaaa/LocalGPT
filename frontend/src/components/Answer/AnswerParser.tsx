import { AskResponse, Citation } from '@api/index'
import { cloneDeep } from 'lodash-es'

export type ParsedAnswer = {
  citations: { [key: string]: CitationsContainer }
  markdownFormatText: string
}

export type CitationsContainer = {
  referenceNumber: number
  citations: Citation[]
}

const lengthDocN = '[doc'.length

function removeDuplicateLinks(text: string) {
  const regex = /((\^\d+\^)\s*)\1+/g
  return text.replace(regex, '$1')
}

export function parseAnswer(answer: AskResponse): ParsedAnswer {
  let answerText = answer.answer
  const citationLinks = answerText.match(/\[(doc\d\d?\d?)]/g)

  const filteredCitations: { [key: string]: CitationsContainer } = {} // { url: [count=1, citations[chunk1, chunk2]] }

  let citationIndex = 1
  answer.citations.forEach(citation => {
    if (citation.url) {
      if (!filteredCitations[citation.url]) {
        filteredCitations[citation.url] = { referenceNumber: citationIndex, citations: [] }
        citationIndex++
      }

      filteredCitations[citation.url].citations.push(citation)
    }
  })

  // convert [doc1], [doc2], ... [docN] references in answer respective to a single reference number and a url
  citationLinks?.forEach(docNRef => {
    let answerCitationIndex = docNRef.slice(lengthDocN, docNRef.length - 1)
    let citation = cloneDeep(answer.citations[Number(answerCitationIndex) - 1]) as Citation

    // replace [doc1] with markdown for reference# and url
    if (citation && citation.url && filteredCitations[citation.url]) {
      answerText = answerText.replaceAll(docNRef, ` ^${filteredCitations[citation.url].referenceNumber}^ `)
    }
  })

  answerText = removeDuplicateLinks(answerText)

  return {
    citations: filteredCitations,
    markdownFormatText: answerText
  }
}
