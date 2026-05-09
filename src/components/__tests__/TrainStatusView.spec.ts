import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TrainStatusView from '../TrainStatusView.vue'
import { api } from '../../services/api'

vi.mock('../../services/api', () => ({
  api: {
    searchTrain: vi.fn(),
    getTrainStatus: vi.fn()
  }
}))

describe('TrainStatusView.vue', () => {
  it('renders search input', () => {
    const wrapper = mount(TrainStatusView, { props: { isDark: true } })
    const input = wrapper.find('input[aria-label="Numero treno"]')
    expect(input.exists()).toBe(true)
  })

  it('shows error if train not found', async () => {
    const mocked = vi.mocked(api.searchTrain)
    mocked.mockResolvedValueOnce([])

    const wrapper = mount(TrainStatusView, { props: { isDark: true } })
    const input = wrapper.find('input')
    await input.setValue('99999')
    await wrapper.find('form').trigger('submit.prevent')

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Treno non trovato')
  })
})
