"use client";

import { useMember } from '@/app/layout';
import { useRouter } from 'next/navigation';
import {
    createContext,
    useState,
    useMemo,
    useContext,
    useEffect
} from 'react';

const AIContext = createContext(null);

export default function AIProvider({ children }) {

    const memberContext = useMember();
    console.log('memberContext in AIProvider', memberContext);
    const { isLoggedIn, setIsLoggedIn, type, setType, user, setUser } = memberContext;

    const router = useRouter();

    const apiKey = process.env.NEXT_PUBLIC_GROK_API_KEY;
    const baseURL = process.env.NEXT_PUBLIC_GROK_URL;
    console.log('Grok apiKey', apiKey);
    console.log('Grok baseURL', baseURL);

    const [voiceCommand, setVoiceCommand] = useState(null);
    const [pageCommands, setPageCommands] = useState([]);
    const [pageCommandAvailablePayloads, setPageCommandAvailablePayloads] = useState({});
    const [commandHandler, setCommandHandler] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    console.log('voiceCommand', voiceCommand);
    console.log('pageCommands', pageCommands);
    console.log('pageCommandAvailablePayloads', pageCommandAvailablePayloads);
    // console.log('AAABBBcommandHandler', commandHandler);


    function registerVoiceControl(pageCommands, availablePayloads, commandHandler) {
        // console.log('AAAcommandHandler', commandHandler);
        setPageCommands(pageCommands);
        setPageCommandAvailablePayloads(availablePayloads);
        setCommandHandler(() => commandHandler);
    }


    const commonCommands = [
        {
            command: "CHANGE_PAGE",
            payload: {
                page: "string"
            }
        },
        {
            command: "LOGOUT",
            payload: {}
        }
    ]

    const availablePayloads = {
        "page": ["HOME", "MERCHANTS", "SUBSCRIBED_MERCHANTS", "ORDER_HISTORY", "ITEMS", "ORDER_CART"]
    }


    // const analyzeCommand = async (command) => {
    //   console.log('analyzeCommand', command);

    // };

    useEffect(() => {

        async function callGrokAPI() {

            // console.log('voiceCommand:', voiceCommand);
            // console.log('commonCommands:', commonCommands);
            // console.log('pageCommands:', pageCommands);
            // console.log('availablePayloads:', availablePayloads);
            // console.log('pageCommandAvailablePayloads:', pageCommandAvailablePayloads);


            // console.log([...commonCommands, ...pageCommands]);
            // console.log({ ...availablePayloads, ...pageCommandAvailablePayloads });

            setIsLoading(true);

            const response = await fetch(baseURL, { // Replace with actual Grok API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}` // Replace with your actual API key
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an voice command interpreter for a web application.'
                        },
                        // { role: 'user', content: 'Generate a list of popular fruits.' }
                        {
                            role: 'user',
                            content: `
                Your task is to analyze the user's voice input and convert it into a structured command format that the application can understand. 
                The user input is: "${voiceCommand}"

                Here are the commands template you can use:
                ${JSON.stringify([...commonCommands, ...pageCommands])}

                The available payload values are:
                ${JSON.stringify({ ...availablePayloads, ...pageCommandAvailablePayloads })}
                      `
                        }
                    ],
                    model: 'grok-4-fast-reasoning', // Replace with the specific Grok model you are using
                    response_format: { type: 'json_object' } // Crucial for JSON response
                })
            });

            console.log('Grok response', response);

            const data = await response.json();
            console.log('Grok data', data);
            console.log('Grok data', data.choices[0].message.content);

            const resolvedCommand = JSON.parse(data.choices[0].message.content);
            console.log('FFFresolvedCommand', resolvedCommand);
            console.log('commandHandler', commandHandler);

            if (resolvedCommand.command === "CHANGE_PAGE" && resolvedCommand.payload.page === "HOME") {
                router.push('/');
            } else if (resolvedCommand.command === "CHANGE_PAGE" && resolvedCommand.payload.page === "MERCHANTS") {
                router.push('/members/clients/merchants');
            } else if (resolvedCommand.command === "CHANGE_PAGE" && resolvedCommand.payload.page === "SUBSCRIBED_MERCHANTS") {
                router.push('/members/clients/subscribed-merchants');
            } else if (resolvedCommand.command === "CHANGE_PAGE" && resolvedCommand.payload.page === "ORDER_HISTORY") {
                router.push('/members/clients/order-history');
            } else if (resolvedCommand.command === "CHANGE_PAGE" && resolvedCommand.payload.page === "ITEMS") {
                router.push('/members/clients/items');
            } else if (resolvedCommand.command === "CHANGE_PAGE" && resolvedCommand.payload.page === "ORDER_CART") {
                router.push('/members/clients/order-cart');
            } else if (resolvedCommand.command === "LOGOUT") {
                const userConfirmed = confirm("Log out now?");
                if (userConfirmed) {
                    // Code to execute if the user clicked "OK" (Yes)
                    localStorage.removeItem('token');
                    localStorage.removeItem('userType');
                    localStorage.removeItem('username');
                    localStorage.removeItem('itemQuantity');
                    localStorage.removeItem('orderCart');
                    setIsLoggedIn(false);
                    setType(null);
                    setUser(null);
                    router.replace('/');
                    // window.location.href = '/';
                }
            } else {
                // console.log('commandHandler', commandHandler);
                // console.log('resolvedCommand', resolvedCommand);
                console.log('CCC calling commandHandler');
                if (commandHandler) {
                    console.log('DDD calling commandHandler');
                    commandHandler(resolvedCommand);
                }
            }

            setVoiceCommand(null);
            setIsLoading(false);


        }
        // console.log('voice changed');
        // console.log('voiceCommand', voiceCommand);
        // console.log('commandHandler', commandHandler);
        if (voiceCommand && commandHandler
            || voiceCommand && commonCommands
        ) {
            callGrokAPI();

        }


    }, [voiceCommand, commandHandler])


    const aiValue = useMemo(
        () => {
            return { voiceCommand, setVoiceCommand, registerVoiceControl, isLoading, setIsLoading }
        }, [voiceCommand, isLoading]
    );
    console.log(aiValue);

    return (
        <AIContext.Provider value={aiValue}>
            {children}
        </AIContext.Provider>

    )


}

export function useAI() {
    const ai = useContext(AIContext);
    if (ai === null) {
        throw new Error(
            "useAI hook must be used within AIContextProvider"
        )
    }
    console.log(ai);
    return ai;
}