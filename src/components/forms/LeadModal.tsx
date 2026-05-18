"use client";

import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { Modal } from "@/components/ui/Modal";
import { useLeadModal } from "@/contexts/LeadModalContext";

export function LeadModal() {
  const { close, isOpen } = useLeadModal();

  return (
    <Modal onClose={close} open={isOpen} title="Оставить заявку">
      <h2 className="text-xl font-semibold text-foreground">Оставить заявку</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Оставьте контактные данные — менеджер свяжется с вами, уточнит задачу и поможет
        подобрать оборудование или запасные части.
      </p>
      <div className="mt-6">
        <ConsultationForm submitLabel="Отправить заявку" />
      </div>
    </Modal>
  );
}
