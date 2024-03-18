import React, { useState } from 'react';
import { ChakraProvider, Box, Flex, Heading, Text, VStack, Button } from '@chakra-ui/react';
import MapComponent from './MapComponent';

function App() {
  const [selectedAirports, setSelectedAirports] = useState({
    firstAirport: null,
    secondAirport: null,
    distance: null,
  });

  // Function to update the selected airports
  const updateSelectedAirports = (airport, isSecondAirport = false) => {
    setSelectedAirports(prevState => ({
      ...prevState,
      [isSecondAirport ? 'secondAirport' : 'firstAirport']: airport,
    }));
  };

  // Function to update the distance
  const updateDistance = (distance) => {
    setSelectedAirports(prevState => ({ ...prevState, distance }));
  };

  return (
    <ChakraProvider>
      <Flex direction="column" h="100vh">
        <Box bg="blue.500" color="white" p={4}>
          <Heading as="h1" size="lg">Australian Airports Map</Heading>
        </Box>
        <Flex flex="1" overflow="hidden">
          <Box w="250px" bg="gray.100" p={4}>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="xl">Airport Information</Text>
              <Box p={4}>
                {selectedAirports.firstAirport && (
                  <Text fontSize="md">First airport: {selectedAirports.firstAirport.name}</Text>
                )}
                {selectedAirports.secondAirport && (
                  <Text fontSize="md">Second airport: {selectedAirports.secondAirport.name}</Text>
                )}
                {selectedAirports.distance && (
                  <Text fontSize="md">Distance: {selectedAirports.distance} km</Text>
                )}
              </Box>
            </VStack>
          </Box>
          <Box flex="1" bg="gray.200">
            <MapComponent updateSelectedAirports={updateSelectedAirports} updateDistance={updateDistance} />
          </Box>
        </Flex>
        <Button onClick={() => setSelectedAirports({ firstAirport: null, secondAirport: null, distance: null })}>
          Reset Selections
        </Button>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
