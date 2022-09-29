import React from "react"
import { Button as ChakuraButton, ButtonProps } from "@chakra-ui/react"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"

type ButtonType =
    | "big-green-plus"
    | "big-pink-minus"
    | "base-blue"
    | "base-dark"
    | "base-green"
    | "outline-green"
    | "base-pink"
    | "outline-pink"
    | "outline-white"
    | "rectangle-teal"
    | "outline-red"

interface ButtonState extends Partial<ButtonProps> {
    text: string
    customType?: ButtonType
    onClick?: () => void
}

function Button({ text, customType, onClick, ...props }: ButtonState) {
    switch (customType) {
        case "base-blue":
            return (
                <ChakuraButton
                    size="md"
                    color="white"
                    bgColor="#353E80"
                    borderRadius="10px"
                    onClick={onClick!}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )

        case "base-dark":
            return (
                <ChakuraButton
                    size="md"
                    color="white"
                    border="1px"
                    borderColor={"#353E80"}
                    borderRadius="10px"
                    variant="solid"
                    onClick={onClick!}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )
        case "base-green":
            return (
                <ChakuraButton size="md" onClick={onClick!} bg={"green.400"} color="white" {...props}>
                    {text}
                </ChakuraButton>
            )
        case "outline-green":
            return (
                <ChakuraButton
                    size="md"
                    variant="outline"
                    onClick={onClick!}
                    color={"green.600"}
                    borderColor={"green.600"}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )
        case "big-green-plus":
            return (
                <ChakuraButton
                    size="md"
                    onClick={onClick!}
                    colorScheme="green"
                    variant="outline"
                    leftIcon={<AddIcon />}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )

        case "base-pink":
            return (
                <ChakuraButton size="md" onClick={onClick!} color={"white"} bg={"pink.400"} {...props}>
                    {text}
                </ChakuraButton>
            )

        case "outline-pink":
            return (
                <ChakuraButton
                    size="md"
                    variant="outline"
                    onClick={onClick!}
                    color={"pink.600"}
                    borderColor={"pink.600"}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )
        case "big-pink-minus":
            return (
                <ChakuraButton
                    size="md"
                    onClick={onClick!}
                    colorScheme="pink"
                    variant="outline"
                    leftIcon={<MinusIcon />}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )

        case "outline-white":
            return (
                <ChakuraButton size="sm" onClick={onClick!} variant="outline" borderRadius="20px" {...props}>
                    {text}
                </ChakuraButton>
            )

        case "rectangle-teal":
            return (
                <ChakuraButton colorScheme="teal" variant="ghost" onClick={onClick!} {...props}>
                    {text}
                </ChakuraButton>
            )

        case "outline-red":
            return (
                <ChakuraButton
                    size="md"
                    variant="outline"
                    onClick={onClick!}
                    color={"red.500"}
                    borderColor={"red.500"}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )

        default:
            return (
                <ChakuraButton size="md" onClick={onClick!} colorScheme="gray" variant="outline" {...props}>
                    {text}
                </ChakuraButton>
            )
    }
}

export default Button
