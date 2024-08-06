'use client'

import {
    Alert,
    Button,
    Container,
    Form,
    InputGroup,
    Modal,
    Nav,
    Navbar,
    NavDropdown,
    Spinner,
    Stack
} from "react-bootstrap";
import {FormEvent, useEffect, useRef, useState} from "react";
import FunctionBuilder from "@/components/FunctionBuilder";
import Script from "next/script";

interface HistoryEntry {
    query: string,
    response: string
    error: boolean
}

interface AppState {
    history: HistoryEntry[]
    currentEntry: number,
}

export default function App() {
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [oasis, setOasis] = useState(null);
    const [appState, setAppState] = useState<AppState>({history: [], currentEntry: 0});
    const [showHelp, setShowHelp] = useState(false);
    const [showDerivativeBuilder, setShowDerivativeBuilder] = useState(false);
    const [showIntegralBuilder, setShowIntegralBuilder] = useState(false);
    const [showLogBuilder, setShowLogBuilder] = useState(false);
    const [showInDevWarning, setShowInDevWarning] = useState(true);
    const [showCookieDisclosure, setShowCookieDisclosure] = useState(true);

    function addToHistory(query: string, response: string) {
        setAppState({...appState, history: [...appState.history, {query, response, error: false}], currentEntry: 0});
    }

    function addErrorToHistory(query: string, response: string) {
        setAppState({...appState, history: [...appState.history, {query, response, error: true}], currentEntry: 0});
    }

    function appendToInput(addition: string) {
        if (!inputRef.current) return;
        inputRef.current.value += (inputRef.current.value === '' ? '' : ' ') + addition;
        parseInput()
    }

    function parseInput() {
        if (!oasis || !inputRef.current?.value) return;

        if (appState.currentEntry) {
            oasis.ccall('Oa_Free', 'void', ['number'], [appState.currentEntry]);
        }

        const preprocessedInput = oasis.ccall('Oa_PreProcessInFix', 'string', ['string'], [inputRef.current?.value]);
        const expression = oasis.ccall('Oa_FromInFix', 'number', ['string'], [preprocessedInput]);
        setAppState({...appState, currentEntry: expression})
    }

    function closeHelp() {
        setShowHelp(false)
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();

        if (!oasis || !appState.currentEntry) return;

        const queryStr = oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [appState.currentEntry])

        if (inputRef.current) {
            inputRef.current.value = '';
        }

        let result;
        try {
            result = oasis.ccall('Oa_SimplifyNF', 'number', ['number'], [appState.currentEntry]);
        } catch (error) {
            addErrorToHistory(queryStr, (error as Error).message)
            return;
        }

        const resultStr = oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [result])

        oasis.ccall('Oa_Free', 'void', ['number'], [result]);
        oasis.ccall('Oa_Free', 'void', ['number'], [appState.currentEntry]);

        addToHistory(queryStr, resultStr);
    }

    function downloadXML() {

        const xmlDoc = document.implementation.createDocument(null, "root");
        const domParser = new window.DOMParser();

        for (const {query, response, error} of appState.history) {
            const entryElem = xmlDoc.createElement("Entry");

            const queryElem = xmlDoc.createElement("Query");

            const queryMathElem = xmlDoc.createElement("math");
            queryMathElem.setAttribute("display", "block");

            const queryElemContent = domParser.parseFromString(query, 'text/xml');
            queryMathElem.appendChild(queryElemContent.documentElement.cloneNode(true));

            queryElem.appendChild(queryMathElem);

            const responseElem = xmlDoc.createElement(error ? "Error" : "Response")
            if (error) {
                responseElem.textContent = response;
            } else {
                const responseMathElem = xmlDoc.createElement("math");
                responseMathElem.setAttribute("display", "block");

                const responseElemContent = domParser.parseFromString(response, 'text/xml');
                responseMathElem.appendChild(responseElemContent.documentElement.cloneNode(true));

                responseElem.appendChild(responseMathElem);
            }

            entryElem.appendChild(queryElem);
            entryElem.appendChild(responseElem);
            xmlDoc.documentElement.appendChild(entryElem);
        }

        const serializer = new XMLSerializer();
        const xmlString = serializer.serializeToString(xmlDoc);

        const blob = new Blob([xmlString], {type: "text/xml"});
        const url = URL.createObjectURL(blob);
        window.open(url);
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [appState]);

    const loadingScreen = (
        <Stack className={"align-items-center justify-content-center vh-100"} gap={3}>
            <Spinner/>
            <h1 className={"mx-3"}>Hold on! Paradise is on its way!</h1>
        </Stack>
    );

    const app = (
        <>
            <FunctionBuilder title={"Derivative Builder"} func={"dd"} firstArgLabel={"Argument"}
                             secondArgLabel={"Variable"} show={showDerivativeBuilder}
                             setShow={setShowDerivativeBuilder}
                             setResult={appendToInput} oasis={oasis!}/>
            <FunctionBuilder title={"Integral Builder"} func={"in"} firstArgLabel={"Argument"}
                             secondArgLabel={"Variable"} show={showIntegralBuilder}
                             setShow={setShowIntegralBuilder}
                             setResult={appendToInput} oasis={oasis!}/>
            <FunctionBuilder title={"Logarithm Builder"} func={"log"} firstArgLabel={"Base"}
                             secondArgLabel={"Argument"} show={showLogBuilder}
                             setShow={setShowLogBuilder}
                             setResult={appendToInput} oasis={oasis!}/>
            <Modal show={showHelp} onHide={closeHelp}>
                <Modal.Header closeButton>
                    <Modal.Title>Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={"pb-3"}>
                        Welcome to OASIS! To get started, type in any expression such as "2x+3x". Oasis automatically
                        recognizes the variables and is able to add them for you. Some variable names are reserved. For
                        instance "i" is reserved for imaginary numbers.
                    </div>
                    <h5>Functions</h5>
                    Oasis also understands some functions. For instance, <code>dd(x^2,x)</code> takes derivative of x^2
                    with respect to x. Likewise, <code>in(2x,x)</code> takes the integral of 2x with respect to x
                    and &nbsp; <code>log(10,100)</code>
                    takes the logarithm of 100 with a base of 10.
                </Modal.Body>
            </Modal>
            <Stack className="min-vh-100">
                <Navbar expand="lg" className="bg-body" sticky="top">
                    <Container>
                        <Navbar.Brand>OASIS Web</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavDropdown title="File">
                                    <NavDropdown.Item as={"button"} onClick={downloadXML}>Export as
                                        XML</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Functions">
                                    <NavDropdown.Item as={"button"}
                                                      onClick={() => setShowDerivativeBuilder(true)}>Derivative</NavDropdown.Item>
                                    <NavDropdown.Item as={"button"}
                                                      onClick={() => setShowIntegralBuilder(true)}>Integral</NavDropdown.Item>
                                    <NavDropdown.Item as={"button"}
                                                      onClick={() => setShowLogBuilder(true)}>Logarithm</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Help">
                                    <NavDropdown.Item as={"button"} onClick={() => setShowHelp(true)}>Get
                                        Started</NavDropdown.Item>
                                    <NavDropdown.Item href="https://github.com/open-algebra/Oasis/issues/new/choose">File
                                        an Issue</NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Header>GitHub Repositories</NavDropdown.Header>
                                    <NavDropdown.Item
                                        href="https://github.com/open-algebra/Oasis">Oasis</NavDropdown.Item>
                                    <NavDropdown.Item
                                        href="https://github.com/open-algebra/OasisC">OasisC</NavDropdown.Item>
                                    <NavDropdown.Item href="https://github.com/open-algebra/webapp">Oasis
                                        Web</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container fluid className="text-center py-3">
                    <h1>Open Algebra Software for Inferring Solutions</h1>
                    <p className={"lead"}>Web Edition</p>
                </Container>
                <div className={"flex-grow-1 pb-3"}>
                    <Container>
                        <Stack gap={3}>
                            <div>
                                {showInDevWarning &&
                                    <Alert variant={"warning"} onClose={() => setShowInDevWarning(false)} dismissible>Oasis,
                                        OasisC, and Oasis Web are still under active development.
                                        Here be dragons. If something does not work, please feel free to <Alert.Link
                                            href={"https://github.com/open-algebra/Oasis/issues/new/choose"}>file an
                                            issue</Alert.Link>!</Alert>}
                                {showCookieDisclosure &&
                                    <Alert variant={"light"} onClose={() => setShowCookieDisclosure(false)} dismissible>
                                        We use Microsoft Clarity, which uses cookies, to better understand how you use
                                        this website. For more information, see the <Alert.Link
                                        href={"https://privacy.microsoft.com/privacystatement"}>Microsoft Privacy
                                        Statement</Alert.Link>.
                                    </Alert>}
                            </div>
                            {appState.history.map(({query, response, error}, index) => (
                                <Stack gap={2} key={index}>
                                    <div className={"align-self-end bg-primary-subtle rounded-5 p-3"}>
                                        <math display={"block"}
                                              dangerouslySetInnerHTML={{__html: query}}></math>
                                    </div>
                                    {error
                                        ? <div className={"align-self-start bg-danger-subtle rounded-5 p-3"}>
                                            <strong>Error:</strong> {response}
                                        </div>
                                        : <div className={"align-self-start bg-secondary-subtle rounded-5 p-3"}>
                                            <math display={"block"}
                                                  dangerouslySetInnerHTML={{__html: response}}></math>
                                        </div>}
                                </Stack>
                            ))}
                            {
                                !(appState.currentEntry && oasis)
                                    ? null
                                    : <div className={"align-self-end bg-primary-subtle rounded-5 p-3"}>
                                        <math display={"block"}
                                              dangerouslySetInnerHTML={{__html: oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [appState.currentEntry])}}></math>
                                    </div>
                            }
                        </Stack>
                    </Container>
                </div>
                <div className={"bg-body shadow sticky-bottom"}>
                    <Container className={"my-3"}>
                        <Form onSubmit={onSubmit}>
                            <InputGroup hasValidation>
                                <Form.Control
                                    ref={inputRef}
                                    placeholder="Enter an expression..."
                                    isInvalid={appState.currentEntry === 0 && !!inputRef.current?.value}
                                    onChange={parseInput}
                                />
                                <Button
                                    variant="primary"
                                    type={"submit"}
                                    disabled={!appState.currentEntry}
                                >Submit</Button>
                                <Form.Control.Feedback type={"invalid"}>Failed to parse
                                    expression</Form.Control.Feedback>
                            </InputGroup>
                        </Form>
                    </Container>
                </div>
            </Stack>
            <div ref={bottomRef}/>
        </>
    )

    return (
        <>
            <Script src="/OasisC.js" onLoad={() => setOasis((window as any).Module)}/>
            {
                oasis ? app : loadingScreen
            }
        </>
    )
}