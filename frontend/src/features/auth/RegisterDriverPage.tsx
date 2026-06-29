import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerDriverWizardSchema,
  type RegisterDriverWizardInput,
} from 'shared/schemas/auth'
import {
  Bike,
  Clock,
  FileText,
  IdCard,
  Home,
  User,
} from 'lucide-react'
import { useRegisterDriver } from './hooks/useRegisterDriver'
import { messageFromError } from '../../lib/errorMessages'
import { RegisterHeader } from './components/register/RegisterHeader'
import {
  StepIndicator,
  type RegisterStep,
} from './components/register/StepIndicator'
import { AccordionSection } from './components/register/AccordionSection'
import { RegisterField } from './components/register/RegisterField'
import { RegisterSelect } from './components/register/RegisterSelect'
import { DocumentUpload } from './components/register/DocumentUpload'

const VEHICLE_TYPE_OPTIONS = [
  { value: 'motorcycle', label: 'Moto' },
  { value: 'car', label: 'Carro' },
  { value: 'van', label: 'Van' },
  { value: 'bicycle', label: 'Bicicleta' },
]

interface DriverDocuments {
  cnh: File | null
  selfie: File | null
  residence: File | null
}

const EMPTY_DOCUMENTS: DriverDocuments = {
  cnh: null,
  selfie: null,
  residence: null,
}

export function RegisterDriverPage() {
  const [openStep, setOpenStep] = useState<RegisterStep>(1)
  const [documents, setDocuments] = useState<DriverDocuments>(EMPTY_DOCUMENTS)
  const [documentsError, setDocumentsError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDriverWizardInput>({
    resolver: zodResolver(registerDriverWizardSchema),
  })

  const mutation = useRegisterDriver()

  const allDocumentsAttached = Boolean(
    documents.cnh && documents.selfie && documents.residence,
  )

  function setDocument(key: keyof DriverDocuments, file: File | null) {
    setDocuments((previous) => ({ ...previous, [key]: file }))
    if (file) setDocumentsError(false)
  }

  const onValid: SubmitHandler<RegisterDriverWizardInput> = (data) => {
    if (!allDocumentsAttached) {
      setDocumentsError(true)
      setOpenStep(3)
      return
    }

    // Only the personal data has a backend endpoint today. The vehicle data
    // (data.vehicle) and the document files belong to separate endpoints that
    // don't exist yet — they are collected here for when those land.
    mutation.mutate({
      name: data.name,
      cpf: data.cpf,
      cnh: data.cnh,
      phone: data.phone,
      email: data.email,
      password: data.password,
    })
  }

  const onSubmit = handleSubmit(onValid, (formErrors) => {
    if (formErrors.vehicle) setOpenStep(2)
    else setOpenStep(1)
  })

  function toggleStep(step: RegisterStep) {
    setOpenStep((current) => (current === step ? current : step))
  }

  return (
    <main className="mx-auto min-h-screen max-w-[375px] bg-surface-dark font-poppins text-white">
      <div className="flex flex-col gap-6 px-6 pb-10 pt-6">
        <RegisterHeader />

        {openStep === 3 && (
          <div className="flex items-start gap-2">
            <Clock className="size-6 shrink-0 text-white" aria-hidden />
            <div>
              <p className="text-[14px] font-semibold text-white">Prazo de análise</p>
              <p className="text-[8px] font-medium text-accent-blue">
                Seu cadastro será analisado em até 48 horas
              </p>
            </div>
          </div>
        )}

        <StepIndicator current={openStep} />

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <AccordionSection
            icon={User}
            title="Dados Pessoais"
            isOpen={openStep === 1}
            onToggle={() => toggleStep(1)}
          >
            <div className="flex flex-col gap-4">
              <RegisterField
                label="Nome Completo"
                placeholder="Digite seu nome"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name')}
              />
              <RegisterField
                label="CPF"
                placeholder="000.000.000-00"
                inputMode="numeric"
                error={errors.cpf?.message}
                {...register('cpf')}
              />
              <RegisterField
                label="CNH"
                placeholder="Digite o número da CNH"
                inputMode="numeric"
                error={errors.cnh?.message}
                {...register('cnh')}
              />
              <RegisterField
                label="Telefone"
                placeholder="(11) 99999-9999"
                inputMode="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <RegisterField
                label="E-mail"
                type="email"
                placeholder="usuario@email.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <RegisterField
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
          </AccordionSection>

          <AccordionSection
            icon={Bike}
            title="Dados do Veículo"
            isOpen={openStep === 2}
            onToggle={() => toggleStep(2)}
          >
            <div className="flex flex-col gap-4">
              <RegisterSelect
                label="Tipo de veículo"
                placeholder="Selecione o tipo"
                options={VEHICLE_TYPE_OPTIONS}
                error={errors.vehicle?.type?.message}
                {...register('vehicle.type')}
              />
              <RegisterField
                label="Placa"
                placeholder="ABC-1D23"
                error={errors.vehicle?.plate?.message}
                {...register('vehicle.plate')}
              />
              <RegisterField
                label="Modelo"
                placeholder="Digite o modelo"
                error={errors.vehicle?.model?.message}
                {...register('vehicle.model')}
              />
              <RegisterField
                label="Cor"
                placeholder="Digite a cor"
                error={errors.vehicle?.color?.message}
                {...register('vehicle.color')}
              />
            </div>
          </AccordionSection>

          <AccordionSection
            icon={FileText}
            title="Documentos"
            isOpen={openStep === 3}
            onToggle={() => toggleStep(3)}
          >
            <div className="flex flex-col">
              <DocumentUpload
                icon={IdCard}
                title="Foto da CNH"
                description="Envie uma foto nítida da sua CNH"
                value={documents.cnh}
                onChange={(file) => setDocument('cnh', file)}
              />
              <DocumentUpload
                icon={User}
                title="Selfie"
                description="Envie uma selfie de rosto nítido e visível"
                value={documents.selfie}
                onChange={(file) => setDocument('selfie', file)}
              />
              <DocumentUpload
                icon={Home}
                title="Comprovante de residência"
                description="Envie um comprovante dos últimos 3 meses."
                value={documents.residence}
                onChange={(file) => setDocument('residence', file)}
              />
              {documentsError && (
                <span className="mt-3 text-xs text-red-400">
                  Anexe os três documentos para continuar.
                </span>
              )}
            </div>
          </AccordionSection>

          {mutation.isError && (
            <p className="text-sm text-red-400">{messageFromError(mutation.error)}</p>
          )}
          {mutation.isSuccess && (
            <p className="text-sm text-green-400">Cadastro enviado com sucesso!</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-2 w-full rounded-[12px] bg-accent-blue-dark py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {mutation.isPending ? 'Enviando...' : 'Enviar Cadastro'}
          </button>
        </form>
      </div>
    </main>
  )
}
