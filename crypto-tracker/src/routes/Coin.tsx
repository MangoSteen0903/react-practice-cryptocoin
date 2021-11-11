import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import {
  Switch,
  Route,
  useLocation,
  useRouteMatch,
  useParams,
} from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Chart from "./Chart";
import Price from "./Price";
const Title = styled.h1`
  font-size: 25px;
  color: ${(props) => props.theme.accentColor};
`;

const BtnContainer = styled.div`
  width: 30%;
`;
const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  padding: 10px 20px;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Overview = styled.main`
  width: 100%;
  height: 80px;
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.textColor};
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  margin: 30px 0;
  padding: 20px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const Description = styled.p`
  line-height: 20px;
  color: ${(props) => props.theme.textColor};
`;

const InfoTitle = styled.span`
  font-size: 12px;
`;

const InfoValue = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

const NavContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  div:nth-child(2) {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const BackBtn = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.textColor};
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  font-weight: 900;
`;

const Nav = styled.div<{ isActive: boolean }>`
  background-color: white;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  color: ${(props) => (props.isActive ? props.theme.accentColor : "black")};
  border-bottom: 3px solid
    ${(props) => (props.isActive ? props.theme.accentColor : "white")};
  font-size: 12px;
`;
interface RouteParams {
  coinId: string;
}
interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}
interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}
function Coin() {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();

  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );
  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <BtnContainer>
          <BackBtn>
            <Link to="/">&larr;</Link>
          </BackBtn>
        </BtnContainer>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
        <BtnContainer></BtnContainer>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <Info>
              <InfoTitle>Rank:</InfoTitle>
              <InfoValue>{infoData?.rank}</InfoValue>
            </Info>
            <Info>
              <InfoTitle>Symbol:</InfoTitle>
              <InfoValue>{infoData?.symbol}</InfoValue>
            </Info>
            <Info>
              <InfoTitle>Price:</InfoTitle>
              <InfoValue>
                $ {tickersData?.quotes.USD.price.toFixed(3)}
              </InfoValue>
            </Info>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <Info>
              <InfoTitle>Total Supply:</InfoTitle>
              <InfoValue>{tickersData?.total_supply}</InfoValue>
            </Info>
            <Info>
              <InfoTitle>Main supply:</InfoTitle>
              <InfoValue>{tickersData?.max_supply}</InfoValue>
            </Info>
          </Overview>
          <NavContainer>
            <Nav isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Nav>
            <Nav isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Nav>
          </NavContainer>
          <Switch>
            <Route path={`/:coinId/price`}>
              <Price coinId={coinId} tickersData={tickersData} />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
