import { productsDirectory } from '../data/directoryData.js'
import DirectoryPage from './DirectoryPage.jsx'

export default function ProductsOverviewPage() {
  return <DirectoryPage data={productsDirectory} path="/products" crumb="Products" />
}
