import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { workshopShapes, workshopSizes } from '../data'
import type { WorkshopMessage } from '../types'

function WorkshopPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const chatLogRef = useRef<HTMLDivElement | null>(null)
  const messageIdRef = useRef(1)
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [selectedShape, setSelectedShape] = useState<(typeof workshopShapes)[number]['id']>('low')
  const [selectedSize, setSelectedSize] = useState(40)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [canvasText, setCanvasText] = useState('[ TEXTURE LOADED ]')
  const [canvasGenerated, setCanvasGenerated] = useState(false)
  const [messages, setMessages] = useState<WorkshopMessage[]>([
    {
      id: 1,
      type: 'ai',
      sender: 'DAWANG_AI',
      text: '视觉生成节点已连接。已载入您上传的纹理图，您可以直接输入文字指令进行物理结构的重构（例：“将主材质变更为液态金属感”）。',
    },
  ])

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    return () => {
      if (uploadedImage?.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImage)
      }
    }
  }, [uploadedImage])

  const handleViewportClick = () => {
    if (!isImageUploaded) {
      fileInputRef.current?.click()
      return
    }
    setIsAiModalOpen(true)
  }

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (uploadedImage?.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedImage)
    }

    const objectUrl = URL.createObjectURL(file)
    setUploadedImage(objectUrl)
    setIsImageUploaded(true)
    setCanvasText('[ TEXTURE LOADED ]')
    setCanvasGenerated(false)
    event.target.value = ''
  }

  const sendPrompt = () => {
    const text = aiPrompt.trim()
    if (!text) return

    const userMessageId = ++messageIdRef.current
    setMessages((previous) => [...previous, { id: userMessageId, type: 'user', sender: 'CREATOR', text }])
    setAiPrompt('')

    window.setTimeout(() => {
      const loadingMessageId = ++messageIdRef.current
      setMessages((previous) => [
        ...previous,
        { id: loadingMessageId, type: 'ai', sender: 'DAWANG_AI', text: '指令已接收，正在结合源纹理重构三维拓扑... [ 预计耗时 3s ]' },
      ])
      setIsGenerating(true)
      setCanvasText('[ COMPUTING_NEURAL_NODES... ]')
      setCanvasGenerated(false)

      window.setTimeout(() => {
        setMessages((previous) =>
          previous.map((msg) =>
            msg.id === loadingMessageId
              ? { ...msg, text: '渲染重构已完成。您可以继续追加指令进行微调，或关闭面板确认应用。' }
              : msg,
          ),
        )
        setIsGenerating(false)
        setCanvasText('[ NEW_RENDER_APPLIED ]')
        setCanvasGenerated(true)
      }, 3000)
    }, 500)
  }

  return (
    <>
      <main className="workshop-layout">
        <section className="viewport-side">
          <input ref={fileInputRef} type="file" className="hidden-file-input" accept="image/*" onChange={handleFileSelected} />

          <div
            className={`viewport-box ${isImageUploaded ? 'ready' : ''}`}
            onClick={handleViewportClick}
            style={
              uploadedImage
                ? {
                    backgroundImage: `url(${uploadedImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  }
                : undefined
            }
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleViewportClick()
              }
            }}
          >
            <div className="viewport-status">{isImageUploaded ? 'AI_READY' : 'AWAITING_TEXTURE'}</div>
            <div className="ws-bracket ws-b-tl" />
            <div className="ws-bracket ws-b-tr" />
            <div className="ws-bracket ws-b-bl" />
            <div className="ws-bracket ws-b-br" />

            {!isImageUploaded ? (
              <div className="upload-ui">
                <div className="upload-icon">+</div>
                <p className="upload-text">[ CLICK TO UPLOAD TEXTURE ]</p>
              </div>
            ) : (
              <div className="viewport-center">[ LAUNCH AI ENGINE ]</div>
            )}

            <div className="viewport-coord">
              X: 0.000
              <br />
              Y: 0.000
              <br />
              Z: 0.000
            </div>
          </div>
        </section>

        <section className="config-side">
          <div className="config-header">
            <h1>Creation Lab.</h1>
          </div>

          <div className="config-step">
            <div className="step-title">01 Base Geometry (基础鞋型)</div>
            <div className="shape-grid">
              {workshopShapes.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  className={`shape-card ${selectedShape === shape.id ? 'active' : ''}`}
                  onClick={() => setSelectedShape(shape.id)}
                >
                  <div className={`shape-icon ${shape.iconClass}`} />
                  <span className="shape-name">{shape.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="config-step">
            <div className="step-title">02 Dimension (物理鞋码)</div>
            <div className="size-grid">
              {workshopSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="action-dock">
          <div className="dock-info">
            <span className="price">¥ 1,299.00</span>
            <span className="time">EST. LEAD TIME: 72 HOURS</span>
          </div>
          <button className="btn-submit" type="button">
            Initiate Build
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </main>

      <div className={`ai-modal ${isAiModalOpen ? 'active' : ''}`}>
        <button type="button" className="ai-modal-bg" onClick={() => setIsAiModalOpen(false)} aria-label="Close AI modal background" />
        <div className="ai-window">
          <button type="button" className="ai-close" onClick={() => setIsAiModalOpen(false)} aria-label="Close AI modal">
            ✕
          </button>

          <div className="ai-left">
            <div className="ai-canvas-header">
              <span>[ AI_VISION_WORKSPACE ]</span>
              <span className="ai-node">NODE: DAWANG_GEN_V4</span>
            </div>
            <div
              className="ai-canvas"
              style={
                uploadedImage
                  ? {
                      backgroundImage: `url(${uploadedImage})`,
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    }
                  : undefined
              }
            >
              {isGenerating ? <div className="scan-line" /> : null}
              <div className={`ai-image-placeholder ${canvasGenerated ? 'generated' : ''}`}>{canvasText}</div>
            </div>
          </div>

          <div className="ai-right">
            <div className="ai-chat-header">
              <h3>AI_RECONSTRUCT</h3>
              <span>// 深度材质与结构重写节点</span>
            </div>
            <div ref={chatLogRef} className="ai-chat-log">
              {messages.map((message) => (
                <div key={message.id} className={`chat-msg ${message.type}`}>
                  <div className="sender">{message.sender}</div>
                  <div className="text">{message.text}</div>
                </div>
              ))}
            </div>
            <div className="ai-input-area">
              <div className="ai-input-wrapper">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(event) => setAiPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      sendPrompt()
                    }
                  }}
                  placeholder="输入 Prompt 指令进行修改..."
                />
                <button type="button" className="ai-send-btn" onClick={sendPrompt}>
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkshopPage
