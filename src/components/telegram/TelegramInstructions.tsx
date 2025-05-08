
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TelegramInstructions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Instruções de Simulação</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Esta é uma simulação de como os clientes interagem com seu bot do Telegram. As vendas automáticas são processadas e enviadas para a página de Vendas.
        </p>
        <p className="text-sm font-medium">Comandos que você pode testar:</p>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mt-2">
          <li>"Quero comprar um vídeo"</li>
          <li>"Mostrar vídeos disponíveis"</li>
          <li>"Quero comprar [nome do vídeo]"</li>
          <li>"Meu ID é [id do assinante]"</li>
        </ul>
      </CardContent>
    </Card>
  );
};
