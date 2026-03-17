"use client";

import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";
import Link from "next/link";

interface CoinBalanceProps {
    balance: number;
    linkTo?: string;
}

const CoinBalance = ({ balance, linkTo }: CoinBalanceProps) => {
    const content = (
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-accent transition-colors">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span>{balance} coins</span>
        </Badge>
    );

    if (linkTo) {
        return <Link href={linkTo}>{content}</Link>;
    }

    return content;
};

export default CoinBalance;
