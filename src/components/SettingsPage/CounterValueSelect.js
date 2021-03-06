// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getCryptoCurrencyById, listFiatCurrencies } from '@ledgerhq/live-common/lib/currencies'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { setCounterValue } from 'actions/settings'
import { counterValueCurrencySelector } from 'reducers/settings'
import Select from 'components/base/Select'
import Track from 'analytics/Track'

// TODO allow more cryptos as countervalues, then refactor this to common
const currencies = [...listFiatCurrencies(), getCryptoCurrencyById('bitcoin')].map(currency => ({
  value: currency.ticker,
  label: `${currency.name} - ${currency.ticker}`,
  currency,
}))

type Props = {
  counterValueCurrency: Currency,
  setCounterValue: string => void,
}

class CounterValueSelect extends PureComponent<Props> {
  handleChangeCounterValue = (item: Object) => {
    const { setCounterValue } = this.props
    setCounterValue(item.currency.ticker)
  }

  render() {
    const { counterValueCurrency } = this.props
    const cvOption = currencies.find(f => f.value === counterValueCurrency.ticker)

    return (
      <Fragment>
        <Track onUpdate event="CounterValueSelect" counterValue={cvOption && cvOption.value} />
        <Select
          small
          minWidth={250}
          onChange={this.handleChangeCounterValue}
          itemToString={item => (item ? item.name : '')}
          renderSelected={item => item && item.name}
          options={currencies}
          value={cvOption}
        />
      </Fragment>
    )
  }
}

export default connect(
  createStructuredSelector({
    counterValueCurrency: counterValueCurrencySelector,
  }),
  { setCounterValue },
)(CounterValueSelect)
