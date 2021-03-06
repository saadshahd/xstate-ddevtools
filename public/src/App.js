import './App.css';
import { App as XStateViz } from '@statecharts/xstate-viz';
import React from 'react';
import Dropdown from './Dropdown';
import Logo from './Logo';
import styled from 'styled-components';

const formatLabel = service =>
  `${service.machine.id} - (uid: ${service.serviceId.slice(0, 3)}...)`;

const StyledLogo = styled(Logo)`
  height: 2rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  padding-top: 2px;
  border-bottom: 1px solid #efefef;
  padding-bottom: 2px;
  padding-left: 1.5rem;
`;

const App = ({ services }) => {
  const [selectedServiceId, setSelectedServiceId] = React.useState(
    services.length > 0 ? services[services.length - 1].serviceId : null
  );

  const selectedService = services.find(
    service => service.serviceId === selectedServiceId
  );

  return (
    <>
      <Header>
        <StyledLogo />
        {selectedService !== undefined ? (
          <Dropdown
            selectedItem={{
              value: selectedServiceId,
              label: `${
                selectedService.hasStopped ? 'Stopped: ' : ''
              }${formatLabel(selectedService)}`
            }}
            setSelectedItem={serviceId => setSelectedServiceId(serviceId)}
            items={services
              .filter(
                service =>
                  (service.hasStopped &&
                    service.serviceId !== selectedServiceId) === false
              )
              .map(service => ({
                label: formatLabel(service),
                value: service.serviceId
              }))}
          />
        ) : (
          <h2>No service</h2>
        )}
      </Header>
      {services.length > 0 ? (
        selectedService.hasStopped ? (
          <h2>The selected service has been stopped.</h2>
        ) : (
          <XStateViz
            machine={selectedService.machine}
            state={selectedService.state}
            serviceSummary={formatLabel(selectedService)}
            events={selectedService.events}
          />
        )
      ) : (
        <h2>No services to display</h2>
      )}
    </>
  );
};

export default App;
