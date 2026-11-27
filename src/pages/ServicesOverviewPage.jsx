import { servicesDirectory } from '../data/directoryData.js'
import DirectoryPage from './DirectoryPage.jsx'

export default function ServicesOverviewPage() {
  return <DirectoryPage data={servicesDirectory} path="/services" crumb="Services" />
}
