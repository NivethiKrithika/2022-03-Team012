import { Route, Routes } from 'react-router-dom';
import { Home, Done, ViewReports } from '../components/IntermediateScreens/';
import {
  Email,
  Location,
  VerifyLocation,
  PhoneNumber,
  Household,
  Bathroom,
  BathroomListing,
  Appliances,
  ApplianceListing
} from '../components/Insert/';
import {
  AverageTV,
  AverageTVDrilldown,
  BathroomStats,
  ExtraFridgeFreezer,
  HouseholdAverage,
  LaundryCenter,
  Search,
  SearchResult,
  Top25,
  Drilldown
} from '../components/Reports/'

function CustomRouter() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        {/* 
          =============
            Inserting
          =============
        */}
        {/* Insert will start at the email screen */}
        <Route path='/insert' element={<Email />} />
        <Route path='/insert/email' element={<Email />} />
        <Route path='/insert/location/:email' element={<Location />} />
        <Route path='/insert/verifyLocation/:email/:postal_code' element={<VerifyLocation />} />
        <Route path='/insert/phoneNumber/:email/:postal_code' element={<PhoneNumber />} />
        <Route path='/insert/household/:email/:postal_code/:phone_number/:type' element={<Household />} />
        <Route path='/insert/bathroom/:email/:count' element={<Bathroom />} />
        <Route path='/insert/bathroomListing/:email/:count' element={<BathroomListing />} />
        <Route path='/insert/appliances/:email/:count' element={<Appliances />} />
        <Route path='/insert/applianceListing/:email/:count' element={<ApplianceListing />} />
        {/* Inserting a hosuehold will end at the Done screen */}
        <Route path='/insert/done/' element={<Done />} />
        {/* 
          ===========
            Reports
          ===========
        */}
        <Route path='/reports' element={<ViewReports />} />
        <Route path='/reports/avgTV' element={<AverageTV />} />
        <Route path='/reports/avgTV/:state' element={<AverageTVDrilldown />} />
        <Route path='/reports/bathroomStats' element={<BathroomStats />} />
        <Route path='/reports/extraFridgeFreezer' element={<ExtraFridgeFreezer />} />
        <Route path='/reports/householdAvg' element={<HouseholdAverage />} />
        <Route path='/reports/laundryCenter' element={<LaundryCenter />} />
        <Route path='/reports/search' element={<Search />} />
        <Route path='/reports/search/:searchTerm' element={<SearchResult />} />'
        <Route path='/reports/top25' element={<Top25 />} />
        <Route path='/reports/top25/:manufacturer' element={<Drilldown />} />
      </Routes>
    </div>
  )
}

export default CustomRouter;
