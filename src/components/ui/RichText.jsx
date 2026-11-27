import { Link } from 'react-router-dom'

const highlight = 'text-primary'
const linkClass = 'font-semibold text-primary underline-offset-4 hover:underline '

/** Renders inline rich-text nodes from the data files: strings, {strong}, {em}, {hl} and {to, content}. */
export function Inline({ nodes }) {
  return nodes.map((node, index) => {
    if (typeof node === 'string') return node
    if (node.strong) return <strong key={index} className="font-semibold text-heading"><Inline nodes={node.strong} /></strong>
    if (node.em) return <em key={index}><Inline nodes={node.em} /></em>
    if (node.hl) return <span key={index} className={highlight}><Inline nodes={node.hl} /></span>
    const content = <Inline nodes={node.content} />
    if (node.to.startsWith('/')) return <Link key={index} to={node.to} className={linkClass}>{content}</Link>
    const external = node.to.startsWith('http')
    return <a key={index} href={node.to} className={linkClass} {...(external && { target: '_blank', rel: 'noreferrer' })}>{content}</a>
  })
}

/** Long-form blocks (headings, paragraphs, lists, contact box) for articles and legal pages. */
export function Blocks({ blocks }) {
  return blocks.map((block, index) => {
    if (block.type === 'h2') return <h2 key={index} className="heading-section mt-10 text-2xl first:mt-0"><Inline nodes={block.content} /></h2>
    if (block.type === 'h3') return <h3 key={index} className="mt-8 text-lg font-semibold"><Inline nodes={block.content} /></h3>
    if (block.type === 'p') return <p key={index} className="mt-4 leading-8"><Inline nodes={block.content} /></p>
    if (block.type === 'ul' || block.type === 'ol') {
      const List = block.type
      return (
        <List key={index} className={`mt-4 space-y-3 pl-5 leading-7 marker:text-primary ${block.type === 'ol' ? 'list-decimal' : 'list-disc'}`}>
          {block.items.map((item, itemIndex) => <li key={itemIndex} className="pl-1"><Inline nodes={item} /></li>)}
        </List>
      )
    }
    if (block.type === 'contact') {
      return (
        <address key={index} className="card mt-6 space-y-2 p-6 not-italic">
          {block.rows.map((row, rowIndex) => <p key={rowIndex}><Inline nodes={row} /></p>)}
        </address>
      )
    }
    return null
  })
}
